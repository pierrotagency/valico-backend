class UserController {
  async getUser({ response, auth }) {
    try {
      const { email, username, created_at } = await auth.getUser();
      return { email, username, created_at };
    } catch (error) {
      response.send('Missing or invalid jwt token');
    }
  }
}
module.exports = UserController;
