package com.sakurahino.ampqclient;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class RabbitMQMessageProducer {

    private final AmqpTemplate amqpTemplate;

    public void publish(Object payload, String exchange, String routingKey) {
        try {
            log.debug("🔁 Publishing to [{}] with routingKey [{}]: {}", exchange, routingKey, payload);
            amqpTemplate.convertAndSend(exchange, routingKey, payload);
            log.info("✅ Message published to exchange [{}] with routingKey [{}]", exchange, routingKey);
        } catch (Exception e) {
            log.error("❌ Failed to publish message to [{}] with routingKey [{}]. Payload: {}", exchange, routingKey, payload, e);
            throw new RuntimeException("RabbitMQ publish failed", e);
        }
    }
}
