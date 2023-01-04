import argon2 from 'argon2';
import Logger from 'frictionless-logger';

const logger = new Logger({
  message: {
    static: {
      text: 'Password Manager',
    },
  },
});

export class Password {
  /*
    Hash string with argon2
    @param {string} password to be hashed
    @returns {string} returns the complete hash
  */
  static async toHash(password: string) {
    try {
      logger.debug('Hashing password');
      // Argon2id is a hybrid combination of the above, being resistant against GPU and tradeoff attacks
      // See https://github.com/ranisalt/node-argon2/wiki/Options#type
      const hash = await argon2.hash(password, { type: argon2.argon2id });

      return hash;
    } catch (err: any) {
      logger.error(`Password hashing failed. Error message: ${err.message}`);
    }
  }

  /*
    Compare password with stored password. Used when checking a password
    supplied by user
    @param {string} the hashed password stored in the database
    @param {string} the plain text password supplied by user
    @returns {boolean} whether or not the hashed password and the plain text
    password match. True for match
  */
  static async compare(storedPassword: string, suppliedPassword: string) {
    try {
      if (await argon2.verify(storedPassword, suppliedPassword)) {
        // Match
        return true;
      } else {
        // Failed
        return false;
      }
    } catch (err: any) {
      logger.error(`Password comparison failed. Error message: ${err.message}`);
    }
  }
}
