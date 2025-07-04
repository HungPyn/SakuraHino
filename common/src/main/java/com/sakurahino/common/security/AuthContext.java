package com.sakurahino.common.security;


import com.sakurahino.common.security.model.UserContext;

public class AuthContext {

    private static final ThreadLocal<UserContext> context = new ThreadLocal<>();

    public static void set(String idUser, String role) {
        context.set(new UserContext(idUser, role));
    }

    public static String getUserId() {
        UserContext ctx = context.get();
        return ctx != null ? ctx.getIdUser() : null;
    }

    public static String getRole() {
        UserContext ctx = context.get();
        return ctx != null ? ctx.getRole() : null;
    }

    public static void clear() {
        context.remove();
    }
}
