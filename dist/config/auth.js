"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("@colyseus/auth");
const fakeDb = [];
auth_1.auth.settings.onFindUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const userFound = fakeDb.find((user) => user.email === email);
    ;
    console.log("onFindUserByEmail", userFound);
    // return a copy of the user object
    return userFound && JSON.parse(JSON.stringify(userFound));
});
auth_1.auth.settings.onRegisterWithEmailAndPassword = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = { email, password, name: email.split("@")[0], errorServerIsStringButClientIsInt: "this should not crash the client", someAdditionalData: true, };
    // keep a copy of the user object
    fakeDb.push(JSON.parse(JSON.stringify(user)));
    return user;
});
auth_1.auth.settings.onRegisterAnonymously = (options) => __awaiter(void 0, void 0, void 0, function* () {
    return Object.assign({ anonymousId: Math.round(Math.random() * 1000), anonymous: true }, options);
});
exports.default = auth_1.auth;
