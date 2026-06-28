package usecase

import (
	"context"
	"math"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/sirupsen/logrus"
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