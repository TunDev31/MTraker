export const isSameDay = (trans, offset) => {
    if (!trans.createdAt) return false;

    let targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - offset);

    const transDate = new Date(trans.createdAt);

    return (
      transDate.getDate() === targetDate.getDate() &&
  transDate.getMonth() === targetDate.getMonth() &&
  transDate.getFullYear() === targetDate.getFullYear()
    );
  };
export const isSameMonth = (trans, offset) => {
    if (!trans.createdAt) return false;

    let now = new Date();

    let targetMonthDate = new Date(
      now.getFullYear(),
      now.getMonth() - offset,
      1,
    );

    const transDate = new Date(trans.createdAt);

    return (
      transDate.getMonth() === targetMonthDate.getMonth() &&
      transDate.getFullYear() === targetMonthDate.getFullYear()
    );
  };

export  const isSameYear = (trans, offset) => {
    if (!trans.createdAt) return false;

    let targetYear = new Date().getFullYear() - offset;
    const transDate = new Date(trans.createdAt);

    return transDate.getFullYear() === targetYear;
  };
