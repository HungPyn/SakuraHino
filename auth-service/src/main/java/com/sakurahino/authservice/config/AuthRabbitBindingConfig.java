package com.sakurahino.authservice.config;

import com.sakurahino.clients.commons.RabbitKey;
import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AuthRabbitBindingConfig {

    @Bean
    public TopicExchange userExchange() {
        return new TopicExchange(RabbitKey.EXCHANGE_USER);
    }

    @Bean
    Queue deleteSuccessQueue() {
        return new Queue(RabbitKey.QUEUE_USER_UPDATE);
    }

    @Bean
    public Binding deleteSuccessBinding(Queue deleteSuccessQueue, TopicExchange userExchange) {
        return BindingBuilder
                .bind(deleteSuccessQueue)
                .to(userExchange)
                .with(RabbitKey.ROUTING_USER_UPDATE);

    }
}
