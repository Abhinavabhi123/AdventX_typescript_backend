import { Express, Request, Response } from "express";
import bannerModel from "../models/bannerModel";
import fs from "fs";
import path from "path";

export const AddBanner = async (req: Request, res: Response) => {
  try {
    interface Obj {
      message: string;
      status: number;
      error: string;
    }
    let obj: Obj = {
      message: "",
      status: 0,
      error: "",
    };
    console.log(req.body);
    console.log(req.file);
    if (req.body.title && req.body.subTitle && req.file) {
      new bannerModel({
        title: req.body.title,
        subTitle: req.body.subTitle,
        image: req.file.filename,
      })
        .save()
        .then((data) => {
          obj = {
            message: "Banner added successfully",
            status: 200,
            error: "",
          };
          res.status(obj.status).send(obj);
        });
    } else {
      obj = {
        message: "",
        status: 404,
        error: "Request data not found",
      };
      res.status(obj.status).send(obj);
    }
  } catch (error) {
    console.error(error);
  }
};
export const banners = async (req: Request, res: Response) => {
  try {
    interface Obj {
      message: string;
      status: number;
      error: string;
      bannerData?: {};
    }
    let obj: Obj = {
      message: "",
      status: 0,
      error: "",
    };
    const bannerData = await bannerModel.find();
    if (bannerData) {
      obj = {
        message: "Data fetched successfully",
        status: 200,
        error: "",
        bannerData,
      };
      res.status(obj.status).send(obj);
    } else {
      obj = {
        message: "",
        status: 501,
        error: "Banner data not found",
      };
      res.status(obj.status).send(obj);
    }
  } catch (error) {
    console.error(error);
  }
};

export const deleteBanner = async (req: Request, res: Response) => {
  try {
    interface Obj {
      message: string;
      status: number;
      error: string;
    }
    let obj: Obj = {
      message: "",
      status: 0,
      error: "",
    };
    const { id } = req.query;
    if (id) {
      const bannerData = await bannerModel.findOne({ _id: id });
      if (bannerData) {
        const bannerFolder = path.join(__dirname, "../public/banners");
        const image = bannerData?.image;
        await bannerModel.deleteOne({ _id: id }).then(() => {
          const imagePath = path.join(bannerFolder, image);
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.error(err);
            } else {
              console.log("banner image deleted successfully");
            }
          });
          obj = {
            message: "Banner deleted successfully",
            status: 200,
            error: "",
          };
          res.status(obj.status).send(obj);
        });
      } else {
        obj = {
          message: "",
          status: 401,
          error: `Banner data not found with id${id}`,
        };
        res.status(obj.status).send(obj);
      }
    } else {
      obj = {
        message: "",
        status: 404,
        error: `Banner id is not found`,
      };
      res.status(obj.status).send(obj);
    }
  } catch (error) {
    console.error(error);
  }
};

export const getBanner = async (req: Request, res: Response) => {
  try {
    interface Obj {
      message: string;
      status: number;
      error: string;
      bannerData?: {};
    }
    let obj: Obj = {
      message: "",
      status: 0,
      error: "",
    };
    const { id } = req.query;
    console.log(id);
    if (id) {
      const bannerData = await bannerModel.findOne({ _id: id });
      if (bannerData) {
        obj = {
          message: "Data fetched successfully",
          status: 200,
          error: "",
          bannerData,
        };
        res.status(obj.status).send(obj);
      } else {
        obj = {
          message: "",
          status: 404,
          error: `Can't found banner data with id${id}`,
        };
        res.status(obj.status).send(obj);
      }
    } else {
      obj = {
        message: "",
        status: 404,
        error: "Banner id not found",
      };
      res.status(obj.status).send(obj);
    }
  } catch (error) {
    console.error(error);
  }
};
export const postBannerEdit = async (req: Request, res: Response) => {
  try {
    interface Obj {
      message: string;
      status: number;
      error: string;
    }
    let obj: Obj = {
      message: "",
      status: 0,
      error: "",
    };
    if (req.body) {
      const { title, subTitle, status, id } = req.body;
      if (id) {
        const bannerData = await bannerModel.findOne({ _id: id });
        if (bannerData) {
          if (req.file) {
            const bannerFolder = path.join(__dirname, "../public/banners");
            const image = bannerData?.image;
            await bannerModel.updateOne(
              { _id: id },
              {
                $set: {
                  title,
                  subTitle,
                  status,
                  image: req.file.filename,
                },
              }
            );
            const imagePath = path.join(bannerFolder, image);
            fs.unlink(imagePath, (err) => {
              if (err) {
                console.error(err);
                return;
              } else {
                console.log("banner image deleted successfully");
              }
            });
          } else {
            await bannerModel.updateOne(
              { _id: id },
              {
                $set: {
                  title,
                  subTitle,
                  status,
                },
              }
            );
          }
          obj = {
            message: "Banner updated successfully",
            status: 200,
            error: "",
          };
          res.status(obj.status).send(obj);
        } else {
          obj = {
            message: "",
            status: 404,
            error: `Banner data not found with id${id}`,
          };
        }
      }
    } else {
      obj = {
        message: "",
        status: 404,
        error: "Could not find the banner id",
      };
    }
  } catch (error) {
    console.error(error);
  }
};
