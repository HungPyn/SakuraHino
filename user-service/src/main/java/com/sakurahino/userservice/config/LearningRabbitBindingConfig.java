package com.sakurahino.userservice.config;

import com.sakurahino.clients.commons.RabbitKey;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class LearningRabbitBindingConfig {
    @Bean
    public TopicExchange learningExchange() {
        return new TopicExchange(RabbitKey.EXCHANGE_LEARNING);
    }

    @Bean
    public Queue updateSuccessQueue() {
        return new Queue(RabbitKey.QUEUE_USER_UPDATE_STREAK_AND_EXP);
    }

    @Bean
    public Binding updateLongStreakAndExpScoreSuccessBinding(Queue registerSuccessQueue, TopicExchange authExchange) {
        return BindingBuilder
                .bind(registerSuccessQueue)
                .to(authExchange)
                .with(RabbitKey.ROUTING_USER_UPDATE_STREAK_AND_EXP);
    }
}
