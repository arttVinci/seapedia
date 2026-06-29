package usecase

import (
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/server/internal/entity"
	"github.com/traa/seapedia/server/internal/model"
	"github.com/traa/seapedia/server/internal/model/converter"
	"github.com/traa/seapedia/server/internal/repository"
	"gorm.io/gorm"
)

type CartUsecase struct {
	DB           *gorm.DB
	Log          *logrus.Logger
	Validate     *validator.Validate
	CartRepo     *repository.CartRepository
	CartItemRepo *repository.CartItemRepository
	ProductRepo  *repository.ProductRepository
}

func NewCartUsecase(db *gorm.DB, log *logrus.Logger, validate *validator.Validate,
	cartRepo *repository.CartRepository,
	cartItemRepo *repository.CartItemRepository,
	productRepo *repository.ProductRepository,
) *CartUsecase {
	return &CartUsecase{
		DB:           db,
		Log:          log,
		Validate:     validate,
		CartRepo:     cartRepo,
		CartItemRepo: cartItemRepo,
		ProductRepo:  productRepo,
	}
}

func (u *CartUsecase) GetCart(userID string) (*model.CartResponse, error) {
	cart, err := u.CartRepo.FindByUserID(u.DB, userID)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			// return empty cart response
			return &model.CartResponse{
				Items: make([]model.CartItemResponse, 0),
			}, nil
		}
		u.Log.WithError(err).Error("failed to find cart by user id")
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal mengambil keranjang")
	}

	return converter.CartToResponse(cart), nil
}

func (u *CartUsecase) AddItem(userID string, request *model.AddCartItemRequest) (*model.CartResponse, error) {
	if err := u.Validate.Struct(request); err != nil {
		return nil, fiber.NewError(fiber.StatusBadRequest, "Validasi gagal")
	}

	tx := u.DB.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// find product
	var product entity.Product
	if err := tx.Where("id = ?", request.ProductID).First(&product).Error; err != nil {
		tx.Rollback()
		if err == gorm.ErrRecordNotFound {
			return nil, fiber.NewError(fiber.StatusNotFound, "Produk tidak ditemukan")
		}
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal mencari produk")
	}

	// find or create cart
	var cart entity.Cart
	err := tx.Where("user_id = ?", userID).First(&cart).Error
	if err == gorm.ErrRecordNotFound {
		// create new cart
		cart = entity.Cart{
			ID:      uuid.NewString(),
			UserID:  userID,
			StoreID: &product.StoreID,
		}
		if err := tx.Create(&cart).Error; err != nil {
			tx.Rollback()
			u.Log.WithError(err).Error("failed to create cart")
			return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal membuat keranjang")
		}
	} else if err != nil {
		tx.Rollback()
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal mengambil keranjang")
	} else {
		// cart exists, check store constraint
		if cart.StoreID != nil && *cart.StoreID != product.StoreID {
			tx.Rollback()
			return nil, fiber.NewError(fiber.StatusConflict,
				"Produk dari toko berbeda. Kosongkan keranjang terlebih dahulu atau belanja dari satu toko.")
		}
		if cart.StoreID == nil {
			if err := tx.Model(&cart).Update("store_id", product.StoreID).Error; err != nil {
				tx.Rollback()
				return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal memperbarui toko keranjang")
			}
		}
	}

	// check if product already in cart
	var existingItem entity.CartItem
	err = tx.Where("cart_id = ? AND product_id = ?", cart.ID, product.ID).First(&existingItem).Error
	if err == nil {
		// update quantity
		existingItem.Quantity += request.Quantity
		if err := tx.Save(&existingItem).Error; err != nil {
			tx.Rollback()
			return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal memperbarui item keranjang")
		}
	} else if err == gorm.ErrRecordNotFound {
		// create new cart item
		cartItem := entity.CartItem{
			ID:        uuid.NewString(),
			CartID:    cart.ID,
			ProductID: product.ID,
			Quantity:  request.Quantity,
		}
		if err := tx.Create(&cartItem).Error; err != nil {
			tx.Rollback()
			return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal menambahkan item ke keranjang")
		}
	} else {
		tx.Rollback()
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal memeriksa item keranjang")
	}

	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal menyimpan perubahan")
	}

	// reload cart with items
	return u.GetCart(userID)
}

func (u *CartUsecase) UpdateItem(userID string, itemID string, request *model.UpdateCartItemRequest) (*model.CartResponse, error) {
	if err := u.Validate.Struct(request); err != nil {
		return nil, fiber.NewError(fiber.StatusBadRequest, "Validasi gagal")
	}

	tx := u.DB.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// find and verify ownership
	var item entity.CartItem
	if err := tx.Preload("Cart").Where("id = ?", itemID).First(&item).Error; err != nil {
		tx.Rollback()
		if err == gorm.ErrRecordNotFound {
			return nil, fiber.NewError(fiber.StatusNotFound, "Item keranjang tidak ditemukan")
		}
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal mencari item keranjang")
	}

	// verify cart belongs to user
	if item.Cart != nil && item.Cart.UserID != userID {
		tx.Rollback()
		return nil, fiber.NewError(fiber.StatusForbidden, "Anda tidak memiliki akses ke item ini")
	}

	if request.Quantity <= 0 {
		// remove item
		if err := tx.Delete(&item).Error; err != nil {
			tx.Rollback()
			return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal menghapus item keranjang")
		}

		// if cart is now empty, set store_id to empty
		var count int64
		if err := tx.Model(&entity.CartItem{}).Where("cart_id = ?", item.CartID).Count(&count).Error; err != nil {
			tx.Rollback()
			return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal memeriksa keranjang")
		}
		if count == 0 {
			if err := tx.Model(&entity.Cart{}).Where("id = ?", item.CartID).Update("store_id", nil).Error; err != nil {
				tx.Rollback()
				return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal mengosongkan toko keranjang")
			}
		}
	} else {
		// update quantity
		item.Quantity = request.Quantity
		if err := tx.Save(&item).Error; err != nil {
			tx.Rollback()
			return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal memperbarui item keranjang")
		}
	}

	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal menyimpan perubahan")
	}

	return u.GetCart(userID)
}

func (u *CartUsecase) DeleteItem(userID string, itemID string) (*model.CartResponse, error) {
	tx := u.DB.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// find and verify ownership
	var item entity.CartItem
	if err := tx.Preload("Cart").Where("id = ?", itemID).First(&item).Error; err != nil {
		tx.Rollback()
		if err == gorm.ErrRecordNotFound {
			return nil, fiber.NewError(fiber.StatusNotFound, "Item keranjang tidak ditemukan")
		}
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal mencari item keranjang")
	}

	// verify cart belongs to user
	if item.Cart != nil && item.Cart.UserID != userID {
		tx.Rollback()
		return nil, fiber.NewError(fiber.StatusForbidden, "Anda tidak memiliki akses ke item ini")
	}

	if err := tx.Delete(&item).Error; err != nil {
		tx.Rollback()
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal menghapus item keranjang")
	}

	// if cart is now empty, set store_id to empty
	var count int64
	if err := tx.Model(&entity.CartItem{}).Where("cart_id = ?", item.CartID).Count(&count).Error; err != nil {
		tx.Rollback()
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal memeriksa keranjang")
	}
	if count == 0 {
		if err := tx.Model(&entity.Cart{}).Where("id = ?", item.CartID).Update("store_id", nil).Error; err != nil {
			tx.Rollback()
			return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal mengosongkan toko keranjang")
		}
	}

	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal menyimpan perubahan")
	}

	return u.GetCart(userID)
}
