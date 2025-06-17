package com.sakurahino.clients.commons;

public class RabbitKey {

        // ==== EXCHANGE ====
        public static final String EXCHANGE_AUTH = "exchange.auth";

        // ==== ROUTING KEYS ====
        public static final String ROUTING_REGISTER_SUCCESS = "routing.auth.register.success";
        public static final String ROUTING_SEND_FORGOT_PASSWORD = "routing.auth.send.forgot.password";

        // ==== QUEUE NAMES ====
        public static final String QUEUE_REGISTER_SUCCESS = "queue.auth.register.success";
        public static final String QUEUE_SEND_FORGOT_PASSWORD = "queue.auth.send.forgot.password";

        private RabbitKey() {}

}
