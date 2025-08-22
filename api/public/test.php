<?php
echo 'DB_HOST: ' . ($_ENV['DB_HOST'] ?? 'not set') . PHP_EOL;
echo 'DB_PORT: ' . ($_ENV['DB_PORT'] ?? 'not set') . PHP_EOL;
echo 'DB_USER: ' . ($_ENV['DB_USER'] ?? 'not set') . PHP_EOL;
echo 'DB_NAME: ' . ($_ENV['DB_NAME'] ?? 'not set') . PHP_EOL;
echo 'SECRET_KEY: ' . ($_ENV['SECRET_KEY'] ?? 'not set') . PHP_EOL;
