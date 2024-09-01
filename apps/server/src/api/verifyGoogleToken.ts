import UserService from "../services/user";

const verifyGoogleToken = async ({ token }: { token: string }) => {
    const resultToken = await UserService.verifyGoogleAuthToken(token);
    return resultToken;
}