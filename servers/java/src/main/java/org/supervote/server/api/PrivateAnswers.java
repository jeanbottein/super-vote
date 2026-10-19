package org.supervote.server.api;

import org.springframework.core.MethodParameter;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

/**
 * What the API answers is often the caller's own: their ballot, their polls,
 * their invitations. No cache keeps an answer, the browser's own included,
 * unless its endpoint says it may (the results, the statistics, a poll's
 * places): a ballot kept in a browser's cache would be a receipt on the
 * voter's device, readable long after they hid it.
 */
@RestControllerAdvice
class PrivateAnswers implements ResponseBodyAdvice<Object> {

    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        return true;
    }

    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType contentType,
                                  Class<? extends HttpMessageConverter<?>> converterType,
                                  ServerHttpRequest request, ServerHttpResponse response) {
        if (request.getURI().getPath().startsWith("/api/")
            && !response.getHeaders().containsHeader(HttpHeaders.CACHE_CONTROL)) {
            response.getHeaders().setCacheControl(CacheControl.noStore());
        }
        return body;
    }
}
