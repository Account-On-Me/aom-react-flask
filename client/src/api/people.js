import { GET, POST, DELETE } from './axios';

export const fetchPerson = (id) => {
  return GET(`/account/${id}`);
};

export const fetchPeopleList = () => {
  return GET('/account/list');
};

export const createPerson = (data) => {
  return POST('/account/create', data);
}

export const deletePerson = (id, auth) => {
  return DELETE(`/account/${id}`, {}, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": auth,
    },
  });
}

export const claimPaycheck = (accountId, targetId) => { 
  return POST('/account/claimPaied', {
    accountId,
    targetId,
  });
}