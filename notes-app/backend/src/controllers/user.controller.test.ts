import { expect } from "chai";
import sinon from "sinon";
import {
  registerUser,
  verifyEmail,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  changePassword,
  getCurrentUser,
  getUserById,
  updateUser,
  deleteUser,
} from "./user.controller.js";
import { User } from "../models/user.model.js";
import { mailHelper } from "../utils/mail.utils.js";
// --

describe("User Controller - registerUser", () => {
  let req: any, res: any, next: any;
  beforeEach(() => {
    req = {
      body: {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      },
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    };
    next = sinon.spy();
  });
  afterEach(() => sinon.restore());

  it("should register a new user and return 201", async () => {
    sinon.stub(User, "findOne").resolves(null);
    sinon.stub(User, "create").resolves({
      username: "testuser",
      email: "test@example.com",
      _id: "mid",
    });
    sinon.stub(mailHelper, "sendVerificationEmail").resolves();
    await registerUser(req, res, next);
    expect(res.status.calledWith(201)).to.be.true;
  });

  it("should throw error if user already exists", async () => {
    sinon.stub(User, "findOne").resolves({ username: "testuser" });
    try {
      await registerUser(req, res, next);
    } catch (error: any) {
      expect(error.statusCode).to.equal(409);
    }
  });
});

describe("User Controller - verifyEmail", () => {
  let req: any, res: any, next: any;
  beforeEach(() => {
    req = { body: { email: "test@example.com", otp: "123456" } };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
      cookie: sinon.stub().returnsThis(),
    };
    next = sinon.spy();
  });
  afterEach(() => sinon.restore());

  it("should verify email with valid OTP", async () => {
    const mockUser = {
      email: "test@example.com",
      isVerified: false,
      save: sinon.stub().resolves(),
      generateAccessToken: sinon.stub().returns("at"),
      generateRefreshToken: sinon.stub().returns("rt"),
    };
    sinon.stub(User, "findOne").resolves(mockUser);
    await verifyEmail(req, res, next);
    expect(mockUser.isVerified).to.be.true;
    expect(res.status.calledWith(200)).to.be.true;
  });

  it("should fail with invalid OTP", async () => {
    sinon.stub(User, "findOne").resolves(null);
    try {
      await verifyEmail(req, res, next);
    } catch (error: any) {
      expect(error.statusCode).to.equal(400);
    }
  });
});

describe("User Controller - loginUser", () => {
  let req: any, res: any, next: any;
  beforeEach(() => {
    req = { body: { username: "test", password: "123" } };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
      cookie: sinon.stub().returnsThis(),
    };
    next = sinon.spy();
  });
  afterEach(() => sinon.restore());

  it("should login successfully", async () => {
    const mockUser = {
      isVerified: true,
      isPasswordCorrect: sinon.stub().resolves(true),
      generateAccessToken: sinon.stub().returns("at"),
      generateRefreshToken: sinon.stub().returns("rt"),
      save: sinon.stub().resolves(),
    };
    sinon.stub(User, "findOne").resolves(mockUser);
    await loginUser(req, res, next);
    expect(res.status.calledWith(200)).to.be.true;
  });

  it("should fail if password incorrect", async () => {
    const mockUser = {
      isVerified: true,
      isPasswordCorrect: sinon.stub().resolves(false),
    };
    sinon.stub(User, "findOne").resolves(mockUser);
    try {
      await loginUser(req, res, next);
    } catch (error: any) {
      expect(error.statusCode).to.equal(401);
    }
  });

  // fail if user exists but not verified
  it("should fail if user exists but not verified", async () => {
    const mockUser = {
      isVerified: false,
      isPasswordCorrect: sinon.stub().resolves(true),
      generateAccessToken: sinon.stub().returns("at"),
      generateRefreshToken: sinon.stub().returns("rt"),
      save: sinon.stub().resolves(),
      verificationToken: "123456",
      verificationTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
    sinon.stub(User, "findOne").resolves(mockUser);
    sinon.stub(mailHelper, "sendVerificationEmail").resolves();
    await loginUser(req, res, next);
    expect(res.status.calledWith(403)).to.be.true;
  });
});

describe("User Controller - logoutUser", () => {
  it("should clear cookies and remove refresh token", async () => {
    const req = { user: { _id: "uid" } } as any;
    const res = {
      status: sinon.stub().returnsThis(),
      clearCookie: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    } as any;
    sinon.stub(User, "findByIdAndUpdate").resolves();

    await logoutUser(req, res, sinon.spy());
    expect(res.clearCookie.calledTwice).to.be.true;
  });
});

describe("User Controller - forgot/reset password", () => {
  afterEach(() => sinon.restore());

  it("forgotPassword should send reset link", async () => {
    const req = { body: { email: "t@t.com" } } as any;
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    } as any;
    const mockUser = { email: "t@t.com", save: sinon.stub().resolves() };
    sinon.stub(User, "findOne").resolves(mockUser);
    sinon.stub(mailHelper, "sendResetPasswordEmail").resolves();
    await forgotPassword(req, res, sinon.spy());
    expect(res.status.calledWith(200)).to.be.true;
  });

  it("resetPassword should update password", async () => {
    const req = { params: { token: "raw" }, body: { password: "new" } } as any;
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    } as any;
    const mockUser = { save: sinon.stub().resolves() };
    sinon.stub(User, "findOne").resolves(mockUser);
    await resetPassword(req, res, sinon.spy());
    expect(res.status.calledWith(200)).to.be.true;
  });
});

describe("User Controller - changePassword", () => {
  let req: any, res: any, next: any;
  beforeEach(() => {
    req = {
      user: { _id: "uid" },
      body: { oldPassword: "old", newPassword: "new" },
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    };
    next = sinon.spy();
  });
  afterEach(() => sinon.restore());

  it("should change password successfully with valid credentials", async () => {
    const mockUser = {
      isPasswordCorrect: sinon.stub().resolves(true),
      save: sinon.stub().resolves(),
    };
    sinon.stub(User, "findById").resolves(mockUser);

    await changePassword(req, res, next);
    expect(res.status.calledWith(200)).to.be.true;
    expect(mockUser.isPasswordCorrect.calledWith("old")).to.be.true;
  });

  it("should fail if old password is incorrect", async () => {
    const mockUser = { isPasswordCorrect: sinon.stub().resolves(false) };
    sinon.stub(User, "findById").resolves(mockUser);

    try {
      await changePassword(req, res, next);
    } catch (error: any) {
      expect(error.statusCode).to.equal(401);
      expect(error.message).to.equal("Invalid user credentials");
    }
  });
});

describe("User Controller - CRUD", () => {
  afterEach(() => sinon.restore());

  it("getCurrentUser should return user info", async () => {
    const req = { user: { _id: "1", username: "u", email: "e" } } as any;
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    } as any;
    await getCurrentUser(req, res, sinon.spy());
    expect(res.status.calledWith(200)).to.be.true;
  });

  it("getUserById should return user by ID", async () => {
    const req = { params: { id: "1" } } as any;
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    } as any;
    sinon.stub(User, "findById").resolves({ _id: "1", username: "u" });
    await getUserById(req, res, sinon.spy());
    expect(res.status.calledWith(200)).to.be.true;
  });

  it("updateUser should change username", async () => {
    const req = { params: { id: "1" }, body: { username: "new" } } as any;
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    } as any;
    sinon
      .stub(User, "findByIdAndUpdate")
      .resolves({ _id: "1", username: "new" });
    await updateUser(req, res, sinon.spy());
    expect(res.status.calledWith(200)).to.be.true;
  });

  it("deleteUser should remove user", async () => {
    const req = { params: { id: "1" } } as any;
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    } as any;
    sinon.stub(User, "findById").resolves({ _id: "1" });
    sinon.stub(User, "findByIdAndDelete").resolves();
    await deleteUser(req, res, sinon.spy());
    expect(res.status.calledWith(200)).to.be.true;
  });
});
