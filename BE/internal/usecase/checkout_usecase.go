package usecase

import (
	"context"
	"math"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/sirupsen/logrus"
	"github.com/google/uuid"
	"github.com/traa/seapedia/server/internal/entity"
	"github.com/traa/seapedia/server/internal/model"
	"github.com/traa/seapedia/server/internal/model/converter"
	"github.com/traa/seapedia/server/internal/repository"
	"gorm.io/gorm"
)

type CheckoutUseCase struct {
	DB                       *gorm.DB
	Log                      *logrus.Logger
	Validate                 *validator.Validate
	CartRepository           *repository.CartRepository
	ProductRepository        *repository.ProductRepository
	WalletRepository         *repository.WalletRepository
	WalletTransactionRepo    *repository.WalletTransactionRepository
	OrderRepository          *repository.OrderRepository
	OrderItemRepository      *repository.OrderItemRepository
	OrderStatusHistoryRepo   *repository.OrderStatusHistoryRepository
	DeliveryRepository       *repository.DeliveryRepository
}

func NewCheckoutUseCase(
	db *gorm.DB,
	log *logrus.Logger,
	validate *validator.Validate,
	cartRepo *repository.CartRepository,
	productRepo *repository.ProductRepository,
	walletRepo *repository.WalletRepository,
	walletTxRepo *repository.WalletTransactionRepository,
	orderRepo *repository.OrderRepository,
	orderItemRepo *repository.OrderItemRepository,
	orderStatusHistRepo *repository.OrderStatusHistoryRepository,
	deliveryRepo *repository.DeliveryRepository,
) *CheckoutUseCase {
	return &CheckoutUseCase{
		DB:                       db,
		Log:                      log,
		Validate:                 validate,
		CartRepository:           cartRepo,
		ProductRepository:        productRepo,
		WalletRepository:         walletRepo,
		WalletTransactionRepo:    walletTxRepo,
		OrderRepository:          orderRepo,
		OrderItemRepository:      orderItemRepo,
		OrderStatusHistoryRepo:   orderStatusHistRepo,
		DeliveryRepository:       deliveryRepo,
	}
}

func (u *CheckoutUseCase) calculateDeliveryFee(method string) int64 {
	switch method {
	case "instant":
		return 20000
	case "next_day":
		return 15000
	case "regular":
		return 10000
	default:
		return 10000
	}
}

func (u *CheckoutUseCase) Preview(ctx context.Context, userID string, request *model.CheckoutPreviewRequest) (*model.CheckoutPreviewResponse, error) {
	if err := u.Validate.Struct(request); err != nil {
		u.Log.Warnf("Invalid request body : %+v", err)
		return nil, fiber.NewError(fiber.StatusBadRequest, "Invalid request body")
	}

	db := u.DB.WithContext(ctx)

	cart, err := u.CartRepository.FindByUserID(db, userID)
	if err != nil {
		return nil, fiber.NewError(fiber.StatusNotFound, "Keranjang tidak ditemukan")
	}

	if len(cart.CartItems) == 0 {
		return nil, fiber.NewError(fiber.StatusBadRequest, "Keranjang kosong")
	}

	var subtotal int64 = 0
	for _, item := range cart.CartItems {
		if item.Product != nil {
			subtotal += item.Product.Price * int64(item.Quantity)
		}
	}

	discount := int64(0)
	// TODO: integrate voucher/promo discount calculation in Level 4
	var voucherApplied *model.AppliedDiscountDetail = nil
	var promoApplied *model.AppliedDiscountDetail = nil

	taxable := subtotal - discount
	if taxable < 0 {
		taxable = 0
	}

	tax := int64(math.Round(0.12 * float64(taxable)))
	deliveryFee := u.calculateDeliveryFee(request.DeliveryMethod)
	finalTotal := taxable + tax + deliveryFee

	return converter.CheckoutPreviewToResponse(subtotal, discount, taxable, tax, deliveryFee, finalTotal, voucherApplied, promoApplied), nil
}

func (u *CheckoutUseCase) Checkout(ctx context.Context, userID string, request *model.CheckoutPreviewRequest) error {
	if err := u.Validate.Struct(request); err != nil {
		u.Log.Warnf("Invalid request body : %+v", err)
		return fiber.NewError(fiber.StatusBadRequest, "Invalid request body")
	}

	db := u.DB.WithContext(ctx)
	tx := db.Begin()
	defer tx.Rollback()

	cart, err := u.CartRepository.FindByUserID(tx, userID)
	if err != nil {
		return fiber.NewError(fiber.StatusNotFound, "Keranjang tidak ditemukan")
	}

	if len(cart.CartItems) == 0 {
		return fiber.NewError(fiber.StatusBadRequest, "Keranjang kosong")
	}

	// Extract product IDs
	var productIDs []string
	for _, item := range cart.CartItems {
		productIDs = append(productIDs, item.ProductID)
	}

	// Lock products for update
	products, err := u.ProductRepository.FindByIDsForUpdate(tx, productIDs)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Gagal mengunci produk")
	}

	productMap := make(map[string]*entity.Product)
	for i := range products {
		productMap[products[i].ID] = &products[i]
	}

	var subtotal int64 = 0
	for _, item := range cart.CartItems {
		product, exists := productMap[item.ProductID]
		if !exists {
			return fiber.NewError(fiber.StatusBadRequest, "Produk tidak ditemukan")
		}
		if product.Stock < item.Quantity {
			return fiber.NewError(fiber.StatusBadRequest, "Stok produk tidak mencukupi")
		}
		subtotal += product.Price * int64(item.Quantity)
	}

	discount := int64(0)
	taxable := subtotal - discount
	if taxable < 0 {
		taxable = 0
	}

	tax := int64(math.Round(0.12 * float64(taxable)))
	deliveryFee := u.calculateDeliveryFee(request.DeliveryMethod)
	finalTotal := taxable + tax + deliveryFee

	// Lock wallet for update
	wallet := new(entity.Wallet)
	if err := u.WalletRepository.FindByUserIDForUpdate(tx, wallet, userID); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Gagal mendapatkan dompet")
	}

	if int64(wallet.Balance) < finalTotal {
		return fiber.NewError(fiber.StatusBadRequest, "Saldo tidak mencukupi")
	}

	// Update stock
	for _, item := range cart.CartItems {
		product := productMap[item.ProductID]
		product.Stock -= item.Quantity
		if err := u.ProductRepository.Update(tx, product); err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, "Gagal memperbarui stok produk")
		}
	}

	// Update wallet
	wallet.Balance -= int(finalTotal)
	if err := u.WalletRepository.Update(tx, wallet); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Gagal memotong saldo dompet")
	}

	// Record wallet transaction
	walletTx := &entity.WalletTransaction{
		ID:          uuid.NewString(),
		WalletID:    wallet.ID,
		Type:        "payment",
		Amount:      int(finalTotal),
		Description: "Pembayaran pesanan",
	}
	if err := u.WalletTransactionRepo.Create(tx, walletTx); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Gagal mencatat transaksi dompet")
	}

	dueSimulatedDay := 0
	switch request.DeliveryMethod {
	case "instant":
		dueSimulatedDay = 0
	case "next_day":
		dueSimulatedDay = 1
	case "regular":
		dueSimulatedDay = 3
	default:
		dueSimulatedDay = 3
	}

	// Create order
	storeID := *cart.StoreID // since single-store cart, we just get it from cart
	orderID := uuid.NewString()
	order := &entity.Order{
		ID:                  orderID,
		BuyerID:             userID,
		StoreID:             storeID,
		Status:              "Sedang Dikemas",
		DeliveryMethod:      request.DeliveryMethod,
		Subtotal:            subtotal,
		Discount:            discount,
		DeliveryFee:         deliveryFee,
		Tax:                 tax,
		FinalTotal:          finalTotal,
		AddressID:           request.AddressID,
		CreatedSimulatedDay: 1, // dummy for now, should read from sim_clock
		DueSimulatedDay:     1 + dueSimulatedDay,
	}

	if err := u.OrderRepository.Create(tx, order); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Gagal membuat pesanan")
	}

	// Create order items snapshot
	for _, item := range cart.CartItems {
		product := productMap[item.ProductID]
		orderItem := &entity.OrderItem{
			ID:          uuid.NewString(),
			OrderID:     orderID,
			ProductID:   product.ID,
			ProductName: product.Name,
			Price:       product.Price,
			Quantity:    item.Quantity,
		}
		if err := u.OrderItemRepository.Create(tx, orderItem); err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, "Gagal membuat item pesanan")
		}
	}

	// Create order status history
	statusHistory := &entity.OrderStatusHistory{
		ID:      uuid.NewString(),
		OrderID: orderID,
		Status:  "Sedang Dikemas",
		Note:    "Pesanan berhasil dibuat",
	}
	if err := u.OrderStatusHistoryRepo.Create(tx, statusHistory); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Gagal mencatat riwayat status")
	}

	// Create delivery
	delivery := &entity.Delivery{
		ID:      uuid.NewString(),
		OrderID: orderID,
		Status:  "Sedang Dikemas",
		Earning: 0,
	}
	if err := u.DeliveryRepository.Create(tx, delivery); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Gagal membuat data pengiriman")
	}

	// Clear cart
	for _, item := range cart.CartItems {
		if err := tx.Delete(&item).Error; err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, "Gagal mengosongkan keranjang")
		}
	}
	cart.StoreID = nil
	if err := u.CartRepository.Update(tx, cart); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Gagal mereset keranjang")
	}

	if err := tx.Commit().Error; err != nil {
		u.Log.Warnf("Failed commit transaction : %+v", err)
		return fiber.NewError(fiber.StatusInternalServerError, "Gagal memproses checkout")
	}

	return nil
}