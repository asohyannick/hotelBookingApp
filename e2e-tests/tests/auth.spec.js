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
const test_1 = require("@playwright/test");
const UI_URL = "http://localhost:3000/";
(0, test_1.test)("should sigin in", (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
    yield page.goto(UI_URL);
    yield page.getByRole("link", { name: "Sign In" }).click();
    // Expect a title "to contain" a substring.
    yield (0, test_1.expect)(page.getByRole("heading", { name: "Sign In" })).toBeVisible();
    yield page.locator("[name=email]").fill("user5@gamil.com");
    yield page.locator("[name=password]").fill("password123");
    yield page.getByRole("button", { name: "Login" }).click();
    yield (0, test_1.expect)(page.getByText(" Sign in Successful")).toBeVisible();
    yield (0, test_1.expect)(page.getByRole("link", { name: "My Bookings" })).toBeVisible();
    yield (0, test_1.expect)(page.getByRole("link", { name: "My Hotels" })).toBeVisible();
    yield (0, test_1.expect)(page.getByRole("button", { name: "Sign Out" })).toBeVisible();
}));
(0, test_1.test)("should allow user to register", (_b) => __awaiter(void 0, [_b], void 0, function* ({ page }) {
    yield page.goto(UI_URL);
    yield page.getByRole("link", { name: "Sign In" }).click();
    yield page.getByRole("link", { name: "Create an account here" }).click();
    yield (0, test_1.expect)(page.getByRole("heading", { name: "Create an Account" })).toBeVisible();
}));
