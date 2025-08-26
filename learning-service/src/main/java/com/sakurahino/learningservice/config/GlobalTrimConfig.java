package com.sakurahino.learningservice.config;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.databind.Module;
import com.fasterxml.jackson.databind.deser.BeanDeserializerModifier;
import com.fasterxml.jackson.databind.deser.std.StringDeserializer;
import com.fasterxml.jackson.databind.module.SimpleModule;
import org.springframework.beans.propertyeditors.StringTrimmerEditor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.InitBinder;

import java.io.IOException;

@Configuration
public class GlobalTrimConfig {

    // ✅ Trim + clean JSON body (Jackson)
    @Bean
        public Module stringTrimAndCleanModule() {
        SimpleModule module = new SimpleModule();
        module.setDeserializerModifier(new BeanDeserializerModifier() {
            @Override
            public JsonDeserializer<?> modifyDeserializer(
                    DeserializationConfig config,
                    BeanDescription beanDesc,
                    JsonDeserializer<?> deserializer) {

                if (deserializer instanceof StringDeserializer) {
                    return new JsonDeserializer<>() {
                        @Override
                        public Object deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
                            String result = ((StringDeserializer) deserializer).deserialize(p, ctxt);
                            if (result == null) return null;
                            // Trim đầu/cuối + gộp nhiều khoảng trắng giữa các từ thành 1 space
                            return result.trim().replaceAll("\\s+", " ");
                        }
                    };
                }
                return deserializer;
            }
        });
        return module;
    }

    // ✅ Trim + clean @RequestParam, @ModelAttribute (DataBinder)
    @ControllerAdvice
    public static class TrimStringAdvice {
        @InitBinder
        public void initBinder(WebDataBinder binder) {
            binder.registerCustomEditor(String.class, new StringTrimmerEditor(false) {
                @Override
                public void setAsText(String text) {
                    if (text != null) {
                        // Trim đầu/cuối + gộp nhiều khoảng trắng giữa các từ thành 1 space
                        text = text.trim().replaceAll("\\s+", " ");
                    }
                    super.setValue(text);
                }
            });
        }
    }
}
