package com.sakurahino.ampqclient;

import lombok.AllArgsConstructor;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;


@Configuration
@AllArgsConstructor
public class RabbitMQConfig {

    // Bean quản lý kết nối đến RabbitMQ, do Spring Boot tự cấu hình nếu có đúng dependency
    private final ConnectionFactory connectionFactory;

    /**
     * Tạo RabbitTemplate để gửi message đến RabbitMQ.
     * Được trả về dưới dạng AmqpTemplate để dễ sử dụng và trừu tượng.
     */
    @Bean
    @Primary
    public AmqpTemplate amqpTemplate() {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(jackson2JsonMessageConverter());
        return rabbitTemplate;
    }

    /**
     * Tạo factory cho các listener để xử lý message từ RabbitMQ.
     * Sử dụng trong @RabbitListener để nhận message.
     */
    @Bean
    public SimpleRabbitListenerContainerFactory simpleRabbitListenerContainerFactory() {
        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        factory.setMessageConverter(jackson2JsonMessageConverter());
        return factory;
    }

    /**
     * Tạo converter để tự động chuyển object ↔ JSON khi gửi hoặc nhận message.
     */
    @Bean
    public MessageConverter jackson2JsonMessageConverter() {
        // Dùng Jackson để chuyển đổi message giữa object và JSON
        return new Jackson2JsonMessageConverter();
    }
}
