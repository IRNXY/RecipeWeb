CREATE TABLE roles
(
    id       INT,
    roleName enum ('ADMIN', 'USER') NOT NULL,
    CONSTRAINT pk1_role_id PRIMARY KEY (id)
);

CREATE TABLE users
(
    id          int AUTO_INCREMENT,
    email       varchar(100) NOT NULL UNIQUE,
    first_name  varchar(100) NOT NULL,
    last_name   varchar(100) NOT NULL,
    password    varchar(100) NOT NULL,
    created_at  datetime     NOT NULL,
    modified_at datetime     NOT NULL,
    is_deleted  boolean DEFAULT false,
    role_id     int          NOT NULL,
    CONSTRAINT pk1_uid PRIMARY KEY (id),
    CONSTRAINT fk1_role_id FOREIGN KEY (role_id) REFERENCES roles (id)
);

CREATE TABLE category
(
    id      int,
    catName varchar(100) NOT NULL,
    CONSTRAINT pk1_category_id PRIMARY KEY (id)
);

CREATE TABLE recipes
(
    id           int AUTO_INCREMENT,
    title        varchar(255) NOT NULL,
    author_id    int          NOT NULL,
    description  varchar(255) not null,
    instructions varchar(255) NOT NULL,
    cooking_time varchar(50)  not null,
    serving_size varchar(10)  not null,
    ingredients  varchar(255) not null,
    category_id  int          NOT NULL,
    created_at   datetime     NOT NULL,
    modified_at  datetime     NOT NULL,
    rating       int     DEFAULT 0,
    is_deleted   boolean DEFAULT false,
    is_moderated boolean DEFAULT false, /* every recipe should be moderated by admin */
    is_visible   boolean DEFAULT false, /* user could save a draft of his recipe, but it shouldnt be shown in the list of all recipes) */
    CONSTRAINT pk1_recipe_id PRIMARY KEY (id),
    CONSTRAINT fk1_category_id FOREIGN KEY (category_id) REFERENCES category (id),
    CONSTRAINT fk1_author_id FOREIGN KEY (author_id) REFERENCES users (id)
);



INSERT INTO roles (id, roleName)
VALUES (1, 'ADMIN'),
       (2, 'USER');

INSERT INTO users (email, first_name, last_name, password, created_at, modified_at, is_deleted, role_id)
VALUES ('john.doe@example.com', 'John', 'Doe', '$2b$10$tltHxAowup5ead/9mvKRZutQjGFLbchQAkGrGcnnVjP.Pg2uNomhS', '2024-06-01 12:34:56', '2024-06-01 12:34:56', false,
        1),
       ('jane.smith@example.com', 'Jane', 'Smith', '$2b$10$tltHxAowup5ead/9mvKRZutQjGFLbchQAkGrGcnnVjP.Pg2uNomhS', '2024-06-02 11:23:45', '2024-06-02 11:23:45',
        false, 2),
       ('alice.jones@example.com', 'Alice', 'Jones', '$2b$10$tltHxAowup5ead/9mvKRZutQjGFLbchQAkGrGcnnVjP.Pg2uNomhS', '2024-06-03 10:12:34', '2024-06-03 10:12:34',
        false, 1),
       ('bob.brown@example.com', 'Bob', 'Brown', '$2b$10$tltHxAowup5ead/9mvKRZutQjGFLbchQAkGrGcnnVjP.Pg2uNomhS', '2024-06-04 09:01:23', '2024-06-04 09:01:23',
        false, 2),
       ('charlie.davis@example.com', 'Charlie', 'Davis', '$2b$10$tltHxAowup5ead/9mvKRZutQjGFLbchQAkGrGcnnVjP.Pg2uNomhS', '2024-06-05 08:00:12',
        '2024-06-05 08:00:12', false, 2),
       ('diana.evans@example.com', 'Diana', 'Evans', '$2b$10$tltHxAowup5ead/9mvKRZutQjGFLbchQAkGrGcnnVjP.Pg2uNomhS', '2024-06-06 07:49:01', '2024-06-06 07:49:01',
        false, 1),
       ('edward.foster@example.com', 'Edward', 'Foster', '$2b$10$tltHxAowup5ead/9mvKRZutQjGFLbchQAkGrGcnnVjP.Pg2uNomhS', '2024-06-07 06:37:50',
        '2024-06-07 06:37:50', false, 1),
       ('fiona.green@example.com', 'Fiona', 'Green', '$2b$10$tltHxAowup5ead/9mvKRZutQjGFLbchQAkGrGcnnVjP.Pg2uNomhS', '2024-06-08 05:26:39', '2024-06-08 05:26:39',
        false, 2),
       ('george.hill@example.com', 'George', 'Hill', '$2b$10$tltHxAowup5ead/9mvKRZutQjGFLbchQAkGrGcnnVjP.Pg2uNomhS', '2024-06-09 04:15:28', '2024-06-09 04:15:28',
        false, 1),
       ('hannah.ian@example.com', 'Hannah', 'Ian', '$2b$10$tltHxAowup5ead/9mvKRZutQjGFLbchQAkGrGcnnVjP.Pg2uNomhS', '2024-06-10 03:04:17', '2024-06-10 03:04:17',
        false, 2);

INSERT INTO category (id, catName)
VALUES (1, 'Italian'),
       (2, 'Chinese'),
       (3, 'Indian'),
       (4, 'Mexican'),
       (5, 'Healthy'),
       (6, 'American'),
       (7, 'Mediterranean'),
       (8, 'Thai'),
       (9, 'French'),
       (10, 'Japanese');

INSERT INTO recipes (title, author_id, description, instructions, cooking_time, serving_size, ingredients, category_id,
                     created_at,
                     modified_at,
                     rating, is_deleted,
                     is_moderated, is_visible)
VALUES ('Spaghetti Carbonara', 1, 'A classic Italian pasta dish with eggs, cheese, pancetta, and pepper.', 'Creation',
        '1:30', '500g', 'Special ingredient', 1,
        '2024-06-01 12:00:00', '2024-06-01 12:00:00', 5, false, true, true),
       ('Kung Pao Chicken', 3,
        'A spicy, stir-fried Chinese dish made with chicken, peanuts, vegetables, and chili peppers.', 'Instructions',
        '1:30', '1KG', 'Special ingredient', 2,
        '2024-06-02 13:00:00', '2024-06-02 13:00:00', 4, false, true, true),
       ('Butter Chicken', 3, 'A popular Indian dish made with marinated chicken cooked in a creamy tomato sauce.',
        'Instructions', '2:30', '2kg', 'Special ingredient', 3,
        '2024-06-03 14:00:00', '2024-06-03 14:00:00', 5, false, true, true),
       ('Tacos', 6, 'Mexican dish made with folded or rolled tortillas filled with various mixtures.',
        'Instructions', '2:30', '2kg', 'Special ingredient', 4,
        '2024-06-04 15:00:00', '2024-06-04 15:00:00', 4, false, true, true),
       ('Quinoa Salad', 7, 'A healthy salad made with quinoa, vegetables, and a light dressing.', 'Instructions',
        '2:30', '2kg', 'Special ingredient', 5,
        '2024-06-05 16:00:00', '2024-06-05 16:00:00', 5, false, true, true),
       ('Burger', 7, 'A classic American beef burger with cheese, lettuce, and tomato.', 'Instructions', '2:30', '2kg',
        'Special ingredient',
        6, '2024-06-06 17:00:00',
        '2024-06-06 17:00:00', 4, false, true, true),
       ('Greek Salad', 7, 'A refreshing Mediterranean salad with tomatoes, cucumbers, olives, and feta cheese.',
        'Instructions', '2:30', '2kg', 'Special ingredient', 7,
        '2024-06-07 18:00:00', '2024-06-07 18:00:00', 5, false, true, true),
       ('Pad Thai', 9, 'A popular Thai noodle dish made with shrimp, tofu, peanuts, and bean sprouts.', 'Instructions',
        '2:30', '2kg', 'Special ingredient', 8,
        '2024-06-08 19:00:00', '2024-06-08 19:00:00', 4, false, true, true),
       ('Croissant', 1, 'A buttery, flaky, and crispy French pastry.', 'Instructions', '2:30', '2kg',
        'Special ingredient', 9,
        '2024-06-09 20:00:00', '2024-06-09 20:00:00',
        5, false, true, true),
       ('Sushi', 3, 'A traditional Japanese dish made with vinegared rice, seafood, and vegetables.', 'Instructions',
        '2:30', '2kg', 'Special ingredient', 10,
        '2024-06-10 21:00:00', '2024-06-10 21:00:00', 5, false, true, true);

# SELECT id
# FROM users
# WHERE role_id = '1';
# SELECT *
# FROM recipes;
# SELECT rp.id AS recipe_id, rp.author_id AS author_id, CONCAT(u.first_name, ' ', u.last_name) AS fullName, rp.title
# FROM recipes rp
#          JOIN users u ON u.id = rp.author_id;