package com.sakurahino.notificationservice.config;

import com.sakurahino.clients.commons.RabbitKey;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class NotificationRabbitBindingConfig {
    @Bean
    public TopicExchange authExchange() {
        return new TopicExchange(RabbitKey.EXCHANGE_AUTH);
    }

    @Bean
    public Queue resetPasswordQueue() {
        return new Queue(RabbitKey.QUEUE_SEND_FORGOT_PASSWORD);
    }

    @Bean
    public Binding resetPasswordSuccessBinding(Queue resetPasswordQueue, TopicExchange authExchange) {
        return BindingBuilder
                .bind(resetPasswordQueue)
                .to(authExchange)
                .with(RabbitKey.ROUTING_SEND_FORGOT_PASSWORD);
    }
}
