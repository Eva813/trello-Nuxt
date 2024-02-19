import { Schema, model } from "mongoose";
import type { Document } from "mongoose";
import { ListDocument } from "./List";

export interface BoardDocument extends Document {
  name: string;
  lists: string[] | ListDocument[];
  owner: string;
  coverImage: string;
}

const boardSchema = new Schema(
  {
    name: {
      type: String,
      default: "Untitled Board",
    },
    //"type" 的值是 "Schema.Types.ObjectId"，這表示它是一個 MongoDB 的 ObjectId 類型。ObjectId 是 MongoDB 中用來唯一識別文件的一種特殊型別。這個 "type" 屬性告訴我們，這個 "lists" 陣列中的元素必須是 ObjectId 型別。
    // ref: 用於建立兩個模型之間的關聯。在這裡，ref: "List" 和 ref: "User" 表示 lists 和 owner 欄位分別與 List 和 User 模型相關聯。
    lists: [
      {
        type: Schema.Types.ObjectId,
        ref: "List",
      },
    ],
    // 定義他的 owner
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    coverImage: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Board = model<BoardDocument>("Board", boardSchema);
