export const saveOnLocalStorage = (keyName: string, value: any) => {
  localStorage.setItem(keyName, JSON.stringify(value));
};
