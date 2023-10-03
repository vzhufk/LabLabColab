import { AuthenticationDetails, CognitoUser, CognitoUserAttribute, CognitoUserPool, ICognitoUserAttributeData } from 'amazon-cognito-identity-js';
import config from '../config';

const userPoolId = config.USER_POOL_ID;
const clientId = config.USER_POOL_APP_CLIENT_ID;

const poolData = {
	UserPoolId: `${userPoolId}`,
	ClientId: `${clientId}`,
};

const userPool: CognitoUserPool = new CognitoUserPool(poolData);

let currentUser: CognitoUser | null = userPool.getCurrentUser();


export const TRANSITION_STATES = {
	FORCE_CHANGE_PASSWORD: 'FORCE_CHANGE_PASSWORD'
};

console.log('userPoolId', userPoolId);

export const getCurrentUser = (): CognitoUser | null => {
	return currentUser;
};

const getCognitoUser = (username: string): CognitoUser => {
	const userData = {
		Username: username,
		Pool: userPool,
	};
	const cognitoUser = new CognitoUser(userData);

	return cognitoUser;
};

export const getSession = async (): Promise<unknown> => {
	if (!currentUser) {
		currentUser = userPool.getCurrentUser();
	}

	return new Promise(function (resolve, reject) {
		if (!currentUser) {
			reject('could not find');
			return;
		}
    
		currentUser?.getSession(function (err: Error, session: unknown) {
			if (err) {
				reject(err);
			} else {
				resolve(session);
			}
		});
	}).catch((err) => {
		throw err;
	});
};

export const signUpUserWithEmail = async (username: string, email: string, password: string): Promise<unknown> => {
	return new Promise(function (resolve, reject) {
		const attributeList = [
			new CognitoUserAttribute({
				Name: 'email',
				Value: email,
			}),
		];

		userPool.signUp(username, password, attributeList, [], function (err, res) {
			if (err) {
				reject(err);
			} else {
				resolve(res);
			}
		});
	}).catch((err) => {
		throw err;
	});
};

export const verifyCode = async (username: string, code: string): Promise<unknown> => {
	return new Promise(function (resolve, reject) {
		const cognitoUser = getCognitoUser(username);

		cognitoUser.confirmRegistration(code, true, function (err, result) {
			if (err) {
				reject(err);
			} else {
				resolve(result);
			}
		});
	}).catch((err) => {
		throw err;
	});
};

export const signInWithEmail = async (username: string, password: string): Promise<unknown> => {
	return new Promise(function (resolve, reject) {
		const authenticationData = {
			Username: username,
			Password: password,
		};
		const authenticationDetails = new AuthenticationDetails(authenticationData);

		currentUser = getCognitoUser(username);

		currentUser.authenticateUser(authenticationDetails, {
			onSuccess: function (res) {
				resolve(res);
			},
			onFailure: function (err) {
				reject(err);
			},
			newPasswordRequired: () => {
				reject({ message: TRANSITION_STATES.FORCE_CHANGE_PASSWORD });
			}
		});
	}).catch((err) => {
		throw err;
	});
};

export const signOut = (): void => {
	if (currentUser) {
		currentUser.signOut();
	}
};

export const getAttributes = async (): Promise<unknown> => {
	return new Promise(function (resolve, reject) {
		if (!currentUser) {
			reject('could not find');
			return;
		}

		currentUser.getUserAttributes(function (err, attributes) {
			if (err) {
				reject(err);
			} else {
				resolve(attributes);
			}
		});
	}).catch((err) => {
		throw err;
	});
};

export const setAttribute = async (attribute: ICognitoUserAttributeData): Promise<unknown> => {
	return new Promise(function (resolve, reject) {
		const attributeList = [];
		const res = new CognitoUserAttribute(attribute);
		attributeList.push(res);

		if (!currentUser) {
			reject('could not find');
			return;
		}

		currentUser.updateAttributes(attributeList, (err, res) => {
			if (err) {
				reject(err);
			} else {
				resolve(res);
			}
		});
	}).catch((err) => {
		throw err;
	});
};

export const sendCode = async (username: string): Promise<unknown> => {
	return new Promise(function (resolve, reject) {
		const cognitoUser = getCognitoUser(username);

		if (!cognitoUser) {
			reject(`could not find ${username}`);
			return;
		}

		cognitoUser.forgotPassword({
			onSuccess: function (res) {
				resolve(res);
			},
			onFailure: function (err) {
				reject(err);
			},
		});
	}).catch((err) => {
		throw err;
	});
};

export const forgotPassword = async (username: string, code: string, password: string): Promise<unknown> => {
	return new Promise(function (resolve, reject) {
		const cognitoUser = getCognitoUser(username);

		if (!cognitoUser) {
			reject(`could not find ${username}`);
			return;
		}

		cognitoUser.confirmPassword(code, password, {
			onSuccess: function () {
				resolve('password updated');
			},
			onFailure: function (err) {
				reject(err);
			},
		});
	});
};

export const changePassword = async (oldPassword: string, newPassword: string): Promise<unknown> => {
	return new Promise(function (resolve, reject) {
		if (!currentUser) {
			reject('could not find');
			return;
		}

		currentUser.changePassword(oldPassword, newPassword, function (err, res) {
			if (err) {
				reject(err);
			} else {
				resolve(res);
			}
		});
	});
};
