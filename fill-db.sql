INSERT INTO users VALUES
(1, 'Иван', 'Иванов', 'arteta@gmail.com', 'qwertyss', 'image.jpg'),
(2, 'Сергей', 'Сидоров', 'barguzin@gmail.com', 'qwertyss', 'image2.jpg');

INSERT INTO categories VALUES
(1, 'Книги', 'picture.png'),
(2, 'Разное', 'picture.png'),
(3, 'Посуда', 'picture.png'),
(4, 'Игры', 'picture.png'),
(5, 'Животные', 'picture.png'),
(6, 'Журналы', 'picture.png');

INSERT INTO offers VALUES
(1, 'buy', 'Куплю детские санки', 'Кому нужен этот новый телефон, если тут такое... Бонусом отдам все аксессуары. Таких предложений больше нет! При покупке с меня бесплатная доставка в черте города.', '23243', 'item02.jpg', '16.06.2020', 2),
(2, 'buy', 'Продам новую приставку Sony Playstation 5', 'Не пытайтесь торговаться. Цену вещам я знаю. Кажется, что это хрупкая вещь. Продаю с болью в сердце...', '65526', 'item13.jpg', '03.05.2020', 1),
(3, 'offer', 'Продам отличную подборку фильмов на VHS', 'Мой дед не мог её сломать. Кому нужен этот новый телефон, если тут такое... Это настоящая находка для коллекционера! При покупке с меня бесплатная доставка в черте города. Если найдёте дешевле — сброшу цену.', '4709', 'item12.jpg', '31.05.2020', 1),
(4, 'offer', 'Продам новую приставку Sony Playstation 5', 'Товар в отличном состоянии. Таких предложений больше нет! Продаю с болью в сердце...', '95087', 'item02.jpg', '25.06.2020', 2),
(5, 'offer', 'Продам советскую посуду. Почти не разбита', 'При покупке с меня бесплатная доставка в черте города. Не пытайтесь торговаться. Цену вещам я знаю.', '67994', 'item05.jpg', '18.06.2020', 1);

INSERT INTO comments VALUES
(1, 'А сколько игр в комплекте?', '06.07.2020', 2, 2),
(2, 'Совсем немного...', '31.05.2020', 2, 1),
(3, 'С чем связана продажа? Почему так дешёво?', '11.05.2020', 2, 4),
(4, 'Продаю в связи с переездом. Отрываю от сердца.', '21.07.2020', 2, 5),
(5, 'Неплохо, но дорого.', '21.05.2020', 1, 3),
(6, 'Оплата наличными или перевод на карту?', '13.06.2020', 1, 4),
(7, 'Вы что?! В магазине дешевле.', '19.07.2020', 1, 5),
(8, 'Почему в таком ужасном состоянии?', '23.06.2020', 2, 3),
(9, 'А где блок питания?', '17.07.2020', 2, 1),
(10, 'Даже не знаю что сказать.', '07.07.2020', 1, 2);

INSERT INTO offers_categories VALUES
(2, 1),
(4, 1),
(1, 1),
(2, 2),
(5, 2),
(4, 3),
(5, 3),
(3, 3),
(1, 4),
(4, 4),
(2, 5),
(1, 5),
(3, 5),
(5, 6),
(3, 6),
(4, 6);
