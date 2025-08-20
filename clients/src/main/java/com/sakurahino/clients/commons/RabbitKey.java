package com.sakurahino.clients.commons;

public class RabbitKey {

        // ==== EXCHANGE ====
        public static final String EXCHANGE_AUTH = "exchange.auth";
        public static final String EXCHANGE_USER = "exchange.users";
        public static final String EXCHANGE_LEARNING = "exchange.learning";

        // ==== ROUTING KEYS ====

        // auth-service
        public static final String ROUTING_REGISTER_SUCCESS = "routing.auth.register.success";
        public static final String ROUTING_SEND_FORGOT_PASSWORD = "routing.auth.send.forgot.password";
        public static final String ROUTING_USER_LOGGED_IN = "routing.auth.loggedin";

        // user-service
        public static final String ROUTING_USER_UPDATE = "routing.auth.update.user";

        // learning-service → user-service (streak + exp)
        public static final String ROUTING_USER_UPDATE_STREAK_AND_EXP = "routing.users.update.streak.exp";
        public static final String ROUTING_USER_UPDATE_IS_NEW_USER = "routing.users.update.is.new.user";

        // ==== QUEUE NAMES ====

        // auth-service
        public static final String QUEUE_REGISTER_SUCCESS = "queue.auth.register.success";
        public static final String QUEUE_SEND_FORGOT_PASSWORD = "queue.auth.send.forgot.password";
        public static final String QUEUE_USER_LOGGED_IN = "queue.auth.loggedin";

        // user-service
        public static final String QUEUE_USER_UPDATE = "queue.auth.update.user";

        // learning-service → user-service
        public static final String QUEUE_USER_UPDATE_STREAK_AND_EXP = "queue.users.update.streak.exp";
        public static final String QUEUE_USER_UPDATE_IS_NEW_USER = "queue.users.update.is.new.user";

        private RabbitKey() {}
}
