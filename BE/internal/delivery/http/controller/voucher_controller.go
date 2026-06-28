package controller

import (
	"github.com/gofiber/fiber/v2"
	"github.com/sirupsen/logrus"

	"github.com/traa/seapedia/server/internal/model"
	"github.com/traa/seapedia/server/internal/usecase"
)

type VoucherController struct {
	UseCase *usecase.VoucherUseCase
	Log     *logrus.Logger
}

func NewVoucherController(useCase *usecase.VoucherUseCase, log *logrus.Logger) *VoucherController {
	return &VoucherController{UseCase: useCase, Log: log}
}

func (c *VoucherController) Create(ctx *fiber.Ctx) error {
	request := new(model.CreateVoucherRequest)
	if err := ctx.BodyParser(request); err != nil {
		c.Log.Warnf("Failed to parse request body : %+v", err)
		return fiber.ErrBadRequest
	}

	response, err := c.UseCase.Create(ctx.UserContext(), request)
	if err != nil {
		return err
	}
	return ctx.Status(fiber.StatusCreated).JSON(model.WebResponse[*model.VoucherResponse]{Data: response, Message: "Voucher berhasil dibuat", Success: true})
}

func (c *VoucherController) List(ctx *fiber.Ctx) error {
	responses, err := c.UseCase.FindAll(ctx.UserContext())
	if err != nil {
		return err
	}
	return ctx.JSON(model.WebResponse[[]model.VoucherResponse]{Data: responses, Message: "Daftar voucher", Success: true})
}

func (c *VoucherController) Detail(ctx *fiber.Ctx) error {
	id := ctx.Params("id")
	response, err := c.UseCase.FindById(ctx.UserContext(), id)
	if err != nil {
		return err
	}
	return ctx.JSON(model.WebResponse[*model.VoucherResponse]{Data: response, Message: "Detail voucher", Success: true})
}
