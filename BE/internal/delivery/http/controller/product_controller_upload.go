package controller

import (
	"github.com/gofiber/fiber/v2"
	"github.com/traa/seapedia/server/internal/delivery/http/middleware"
	"github.com/traa/seapedia/server/internal/model"
)

func (c *ProductController) UploadImage(ctx *fiber.Ctx) error {
	auth := middleware.GetUser(ctx)

	request := new(model.UploadImageRequest)
	if err := ctx.BodyParser(request); err != nil {
		c.Log.WithError(err).Error("error parsing request body")
		// It's okay if parsing fails, we just want to grab optional ID
	}

	file, err := ctx.FormFile("image")
	if err != nil {
		c.Log.WithError(err).Error("error parsing form file")
		return fiber.NewError(fiber.StatusBadRequest, "Gambar wajib diunggah")
	}

	if file.Size > 7*1024*1024 {
		c.Log.Warn("Upload failed: file size exceeds 7MB limit")
		return fiber.NewError(fiber.StatusBadRequest, "Ukuran file melebihi 7MB")
	}

	request.Image = file
	request.UserID = auth.ID
	request.ID = ctx.FormValue("id")

	response, err := c.UseCase.UploadImage(ctx.UserContext(), request)
	if err != nil {
		return err
	}

	return ctx.JSON(model.WebResponse[string]{Data: response})
}
