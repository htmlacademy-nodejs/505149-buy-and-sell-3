/* There are SELECTs for checking*/
SELECT
  users.first_name AS "Имя",
	users.last_name AS "Фамилия",
	offers.title AS "Объявление",
  offers.sum AS "Цена",
  offers.created_date AS "Дата"
FROM offers
INNER JOIN users
	ON offers.user_id = users.id;

SELECT
  users.first_name AS "Имя",
	users.last_name AS "Фамилия",
	offers.title AS "Объявление",
  comments.text AS "Комментарий"
FROM comments
INNER JOIN users
	ON comments.user_id = users.id
INNER JOIN offers
	ON comments.offer_id = offers.id;

SELECT
	offers.title AS "Объявление",
	string_agg(categories.title, ', ') AS "Жанры"
FROM offers_categories
LEFT JOIN offers
	ON offers_categories.offer_id = offers.id
LEFT JOIN categories
	ON offers_categories.category_id = categories.id
GROUP BY offers.title;
