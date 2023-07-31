import { Request, Response, NextFunction } from "express";
import { ObjectId } from "mongodb";
import userModel from "../models/userModel";
import communityModel from "../models/communityModel";
import path from "path";
import fs from "fs";

export const getCommunityUsers = async (req: Request, res: Response) => {
  try {
    type Users = {
      _id: ObjectId;
    };
    const userData: (Users | null)[] = await userModel.find({
      $and: [{ status: true }, { primeMember: true }],
    });

    if (!userData) {
      res.status(401).send({ message: "No Prime Users" });
    } else {
      res.status(200).send(userData);
    }
  } catch (error) {
    console.error(error);
  }
};
export const getComUser = async (req: Request, res: Response) => {
  try {
    console.log("ethi");

    const id = req.query.id;
    console.log(id, "idddddd");

    const userData = await userModel.findOne({ _id: id });
    if (userData) {
      console.log("no data");
      res.status(200).send(userData);
    }
  } catch (error) {
    console.error();
  }
};

// * Creating community

export const createCommunity = async (req: Request, res: Response) => {
  try {
    interface cName {
      message: string;
      status: number;
      error: string;
    }

    let obj: cName = {
      message: "",
      status: 0,
      error: "",
    };
    console.log(req.body, "Datrtttt");
    const { cName, status, cMembers } = req.body;
    console.log(req.file, "file");

    const CommData = await communityModel.findOne({ communityName: cName });
    console.log(CommData, "Dataaa");

    if (CommData) {
      console.log("yes");
    } else {
      console.log(cMembers);
      const mData = cMembers;

      interface Value {
        userId: ObjectId;
        status: boolean;
      }

      let members: Value[] = [];
      interface Item {
        _id: ObjectId;
      }

      if (
        !req.body.cName ||
        !req.body.status ||
        !req.body.cMembers ||
        !req.file ||
        !req.file.path
      ) {
        console.error("error");
        obj = {
          message: "",
          status: 404,
          error: `Resource not found,Please try again later`,
        };
        res.status(obj.status).send(obj);
        return;
      }
      let fileName = "";

      if (req.file) {
        fileName = req.file.filename;
      }

      mData.map((item: Item) => {
        const value = {
          userId: item._id,
          status: true,
        };
        members.push(value);
      });
      console.log(members, "userData");

      const data = new communityModel({
        communityName: cName,
        status: status,
        members: members,
        logo: fileName,
      })
        .save()
        .then((data) => {
          console.log(data);

          mData.map(async (item: Item) => {
            await userModel.updateOne(
              { _id: item._id },
              { $push: { community: { communityId: data._id } } }
            );
          });

          obj = {
            message: "Community Created Successfully",
            status: 200,
            error: "",
          };
          res.status(obj.status).send(obj);
        });
      console.log("no");
    }
  } catch (error) {
    console.error(error);
  }
};
export const communities = async (req: Request, res: Response) => {
  try {
    interface Obj {
      message: string;
      status: number;
      error: string;
      community?: {};
    }
    let obj: Obj = {
      message: "",
      status: 0,
      error: "",
      community: {},
    };
    const commData = await communityModel.find();
    if (commData) {
      obj = {
        message: "Communities Fetched",
        status: 200,
        error: "",
        community: commData,
      };
      res.status(obj.status).send(obj);
    } else {
      obj = {
        message: "No Community founded",
        status: 200,
        error: "",
        community: commData,
      };
      res.status(obj.status).send(obj);
    }
  } catch (error) {
    console.error(error);
  }
};

export const getCommunityDetails = async (req: Request, res: Response) => {
  try {
    interface Obj {
      message: string;
      status: number;
      error: string;
      commData?: object;
    }
    let obj: Obj = {
      message: "",
      status: 0,
      error: "",
    };
    const id: string = req.params.id;
    const commData = await communityModel.findOne({ _id: id }).populate({
      path: "members.userId",
      model: "User",
    });
    if (commData) {
      // const data = commData?.members
      // console.log(data)
      // // let hello = data.populate({path:userId,model:"User"})
      // const array:string[]=[]

      // data.map((item)=>{
      //   console.log(item?.userId);
      //   const hello = item.populate('User')
      //   // array.push(item?.userId)
      // })

      obj = {
        message: "Data fetched Successfully",
        status: 200,
        error: "",
        commData,
      };
      res.status(obj.status).send(obj);
    } else {
      console.log("Data not fetched");
      obj = {
        message: "",
        status: 404,
        error: "Data Not fetched",
      };
      res.status(obj.status).send(obj);
    }
  } catch (error) {
    console.error(error);
  }
};
export const changeComStatus = async (req: Request, res: Response) => {
  try {
    interface Obj {
      message: string;
      status: number;
      error: string;
    }
    let obj = {
      message: "",
      status: 0,
      error: "",
    };
    console.log(req.body);
    const { id, userId }: { id: string; userId: string } = req.body;
    const community = await communityModel.findOne({ _id: id });
    if (community) {
      const members = community.members;
      const user = members.map((member) => {
        if (member.userId === userId) {
          member.access = !member.access;
        }
        return member;
      });
      community.members = user as [{ userId: string; access: boolean }];
      await community.save().then(() => {
        obj = {
          message: "Status changed",
          status: 201,
          error: "",
        };
        res.status(obj.status).send(obj);
      });
    } else {
      obj = {
        message: "",
        status: 404,
        error: "Data not found",
      };
      res.status(obj.status).send(obj);
    }
  } catch (error) {
    console.error(error);
  }
};

export const addUserECommunity = async (req: Request, res: Response) => {
  try {
    const commId = req.query.id;
    interface UserData {
      _id: string;
      firstName: string;
      lastName: string;
      community: string[];
    }
    interface Obj {
      message: string;
      status: number;
      error: string;
      userData?: UserData | any;
    }
    let obj: Obj = {
      message: "",
      status: 0,
      error: "",
    };

    const userData = await userModel.find(
      {
        $and: [
          { status: true },
          { primeMember: true },
          { community: { $nin: { communityId: commId } } },
        ],
      },
      { _id: 1, firstName: 1, lastName: 1, community: 1 }
    );
    if (userData) {
      obj = {
        message: "Data fetched Successfully",
        status: 200,
        error: "",
        userData,
      };
      res.status(obj.status).send(obj);
    } else {
      obj = {
        message: "",
        status: 404,
        error: "Data not found",
      };
      res.status(obj.status).send(obj);
    }
  } catch (error) {
    console.error(error);
  }
};

export const changeCommunity = async (req: Request, res: Response) => {
  try {
    interface Obj {
      message: String;
      status: Number;
      error: String;
    }
    const id = req.params.id;
    console.log(id);

    const { selectedOption, cMembers, inputValue } = req.body;
    console.log(req.body);
    let obj: Obj = {
      message: "",
      status: 0,
      error: "",
    };
    if (
      selectedOption === "" ||
      selectedOption === "select" ||
      inputValue <= 0
    ) {
      obj = {
        message: "",
        status: 204,
        error: "something went wrong, try again",
      };
      res.status(204).send(obj);
    } else {
      if (cMembers.length > 0) {
        interface Item {
          _id: string;
        }
        cMembers.map(async (item: Item) => {
          console.log(item);

          const obj = {
            userId: item._id,
            access: true,
          };
          await communityModel.updateOne(
            { _id: id },
            {
              $set: { communityName: inputValue, status: selectedOption },
              $push: { members: obj },
            }
          );
          const CommId = new ObjectId(id);
          await userModel.updateOne(
            { _id: item._id },
            { $push: { community: { communityId: CommId } } }
          );
        });
      } else {
        const data = await communityModel.updateOne(
          { _id: id },
          { $set: { communityName: inputValue, status: selectedOption } }
        );
      }
      obj = {
        message: "Community Updated successfully ",
        status: 200,
        error: "something went wrong, try again",
      };
      res.status(200).send(obj);
    }
  } catch (error) {
    console.error(error);
  }
};
export const deleteCommunity = async (req: Request, res: Response) => {
  try {
    interface Obj {
      message: string;
      status: number;
      error: string;
    }
    const id: string = req.params.id;
    console.log(id);
    let obj: Obj = {
      message: "",
      status: 0,
      error: "",
    };
    const data = await communityModel.findOne({ _id: id });
    if (data) {
      console.log(data?.members);
      const members = data?.members;
      members.map(async (item) => {
        console.log(item?.userId);
        const userId = item?.userId;
        await userModel.updateOne(
          { _id: userId },
          { $pull: { community: { communityId: id } } }
        );
      });
      (async () => {
        await communityModel.deleteOne({ _id: id });
      })().then(() => {
        obj = {
          message: "Deleted successfully",
          status: 200,
          error: "",
        };
        res.status(obj.status).send(obj);
      });
    } else {
      obj = {
        message: "",
        status: 404,
        error: "content not found",
      };
      res.status(obj.status).send(obj);
    }

    console.log("ethi");
  } catch (error) {
    console.error(error);
  }
};

export const userCommunities = async (req: Request, res: Response) => {
  try {
    interface Obj {
      message: string;
      status: number;
      error: string;
      array?: any[];
    }
    let obj: Obj = {
      message: "",
      status: 0,
      error: "",
    };
    const { id } = req.params;
    if (id) {
      const userData = await userModel.findOne(
        { _id: id },
        { community: 1, _id: 0 }
      );
      if (userData) {
        const community = userData?.community;
        let array: any[] = [];
        await Promise.all(
          community.map(async (item, i) => {
            const communityData = await communityModel.findOne({
              $and: [{ _id: String(item?.communityId) }, { status: "Active" }],
            });
            array.push(communityData);
          })
        );
        obj = {
          message: "Data fetched successfully",
          status: 200,
          error: "",
          array,
        };
        res.status(obj.status).send(obj);
      } else {
        obj = {
          message: "",
          status: 404,
          error: "User data not found",
        };
        res.status(obj.status).send(obj);
      }
    } else {
      obj = {
        message: "",
        status: 404,
        error: `User is not there`,
      };
      res.status(obj.status).send(obj);
    }
  } catch (error) {
    console.error(error);
  }
};

export const communityData = async (req: Request, res: Response) => {
  try {
    console.log(req.params);
    console.log(req.query);
  } catch (error) {
    console.error(error);
  }
};

export const changeCommunityWI = async (req: Request, res: Response) => {
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
    const { id } = req.params;
    if (id) {
      if(!req.file){
        return
      }
      const communityData = await communityModel.findOne({ _id: id });
      if (communityData) {
        console.log(req.file.filename);
        await communityModel
          .updateOne({ _id: id }, { $set: { logo: req.file.filename } })
          .then(() => {
            if (communityData?.logo) {
              const imageUrl = communityData?.logo;
              const imagePath = path.join(__dirname, "../public/uploads");
              const delImagePath = path.join(imagePath, imageUrl);
              fs.unlink(delImagePath, (err) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log("image deleted");
                }
              });
            }
            obj={
              message:'Image changed successfully',
              status:200,
              error:""
            }
            res.status(obj.status).send(obj)
          });
      } else {
      obj={
        message:"",
        status:404,
        error:"community Data not found "
      }
      res.status(obj.status).send(obj)
      }
    } else {
      obj={
        message:"",
        status:404,
        error:"Id not found"
      }
      res.status(obj.status).send(obj)
    }
  } catch (error) {
    console.error(error);
  }
};
