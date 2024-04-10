const firestore = jest.fn(() => ({
	collection: jest.fn(() => ({
	  doc: jest.fn(() => ({
		set: jest.fn(() => Promise.resolve()),
		get: jest.fn(() => Promise.resolve({ id: 'docId', data: () => ({}) })),
		delete: jest.fn(() => Promise.resolve()),
	  })),
	  where: jest.fn(() => ({
		get: jest.fn(() => Promise.resolve({ docs: [{ id: 'docId', data: () => ({}) }] })),
	  })),
	})),
  }));
  
  const admin = jest.genMockFromModule('firebase-admin');
  admin.firestore = firestore;
  admin.initializeApp = jest.fn();
  
  module.exports = admin;
  