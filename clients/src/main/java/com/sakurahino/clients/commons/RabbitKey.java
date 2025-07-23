package com.sakurahino.clients.commons;

public class RabbitKey {

        // ==== EXCHANGE ====
        public static final String EXCHANGE_AUTH = "exchange.auth";
        public static final String EXCHANGE_USER = "exchange.users";

        // ==== ROUTING KEYS ====

        // auth-service
        public static final String ROUTING_REGISTER_SUCCESS = "routing.auth.register.success";
        public static final String ROUTING_SEND_FORGOT_PASSWORD = "routing.auth.send.forgot.password";
        public static final String ROUTING_USER_LOGGED_IN = "routing.auth.loggedin";

        //user-service
        public static final String ROUTING_USER_DELETED = "routing.auth.delete.user";
        // ==== QUEUE NAMES ====

        // auth-serivce
        public static final String QUEUE_REGISTER_SUCCESS = "queue.auth.register.success";
        public static final String QUEUE_SEND_FORGOT_PASSWORD = "queue.auth.send.forgot.password";
        public static final String QUEUE_USER_LOGGED_IN = "queue.auth.loggedin";

        //user-service
        public static final String QUEUE_USER_DELETED = "queue.auth.user.deleted";


        private RabbitKey() {}

}
