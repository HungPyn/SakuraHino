package com.sakurahino.userservice.config;

import com.sakurahino.clients.commons.RabbitKey;
import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class UserRabbitBindingConfig {

    @Bean
    public TopicExchange authExchange() {
        return new TopicExchange(RabbitKey.EXCHANGE_AUTH);
    }

    @Bean
    public Queue registerSuccessQueue() {
        return new Queue(RabbitKey.QUEUE_REGISTER_SUCCESS);
    }

    @Bean
    public Binding registerSuccessBinding(Queue registerSuccessQueue, TopicExchange authExchange) {
        return BindingBuilder
                .bind(registerSuccessQueue)
                .to(authExchange)
                .with(RabbitKey.ROUTING_REGISTER_SUCCESS);
    }

    @Bean
    public Queue userLoggedInQueue() {
        return new Queue(RabbitKey.QUEUE_USER_LOGGED_IN);
    }

    @Bean
    public Binding userLoggedInBinding(Queue userLoggedInQueue, TopicExchange authExchange) {
        return BindingBuilder
                .bind(userLoggedInQueue)
                .to(authExchange)
                .with(RabbitKey.ROUTING_USER_LOGGED_IN);
    }
}
