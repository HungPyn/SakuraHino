package com.sakurahino.clients.rabitmqModel;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SendResetCodeMessage {
    private String email;
    private String code;
}
