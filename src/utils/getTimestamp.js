/**Таймштамп представляет собой текущую дату UTC с точностью до дня в формате год, месяц, день без разделителей.
Пароль и таймштамп разделяются символом подчеркивания.
Пример: "20230821"
* @returns {string}
 */
export default function getTimestamp() {
  const currentDate = new Date();
  const utcDay = ("0" + currentDate.getUTCDate()).slice(-2);
  const utcMonth = ("0" + (currentDate.getUTCMonth() + 1)).slice(-2);
  const utcYear = currentDate.getUTCFullYear();

  return utcYear + utcMonth + utcDay;
}
