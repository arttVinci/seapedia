package controller

import (
	"github.com/gofiber/fiber/v2"
	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/server/internal/delivery/http/middleware"
	"github.com/traa/seapedia/server/internal/model"
	"github.com/traa/seapedia/server/internal/usecase"
)

type WalletController struct {
	UseCase *usecase.WalletUseCase
	Log     *logrus.Logger
}

func NewWalletController(useCase *usecase.WalletUseCase, log *logrus.Logger) *WalletController {
	return &WalletController{UseCase: useCase, Log: log}
}

func (c *WalletController) GetWallet(ctx *fiber.Ctx) error {
	userID := middleware.GetUser(ctx).ID
	response, err := c.UseCase.GetWallet(ctx.UserContext(), userID)
	if err != nil {
		return err
	}
	return ctx.JSON(model.WebResponse[*model.WalletWithTransactionsResponse]{
		Data:    response,
		Message: "Data dompet berhasil diambil",
		Success: true,
	})
}

func (c *WalletController) Topup(ctx *fiber.Ctx) error {
	userID := middleware.GetUser(ctx).ID
	request := new(model.TopupRequest)
	if err := ctx.BodyParser(request); err != nil {
		c.Log.Warnf("Failed to parse request body: %+v", err)
		return fiber.ErrBadRequest
	}

	response, err := c.UseCase.Topup(ctx.UserContext(), userID, request)
	if err != nil {
		return err
	}
	return ctx.JSON(model.WebResponse[*model.WalletResponse]{
		Data:    response,
		Message: "Top-up berhasil",
		Success: true,
	})
}
