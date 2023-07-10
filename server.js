"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.fileFilter = exports.storage = void 0;
const express_1 = __importDefault(require("express"));
const dotenv = __importStar(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const db_1 = __importDefault(require("./db"));
dotenv.config();
const app = (0, express_1.default)();
const Port = process.env.PORT || 3000 || 5000;
(0, db_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN,
    methods: process.env.CORS_METHODS,
    credentials: true
}));
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: false }));
app.use('/uploads', express_1.default.static('uploads'));
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
exports.storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === 'image/jpg') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
exports.fileFilter = fileFilter;
exports.upload = (0, multer_1.default)({
    storage: exports.storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter: exports.fileFilter,
});
app.use("/", userRoutes_1.default);
app.use("/admin", adminRoutes_1.default);
app.listen(Port, () => console.log(`⚡️[Server] : Server is running at http://localhost:${Port}`));
