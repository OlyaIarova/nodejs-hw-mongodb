export const ctrlWrapper = (controller) => {//для автоматичної обробки помилок
  return async (req, res, next) => {
    try {//виконує переданий контролер
      await controller(req, res, next);
    } catch (error) {//при виникненні помилки передається до наступного мідлверу
      next(error);
    }
  };
};
