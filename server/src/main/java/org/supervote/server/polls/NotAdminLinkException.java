package org.supervote.server.polls;

/** An admin token that is not this poll's. */
public class NotAdminLinkException extends RuntimeException {

    public NotAdminLinkException(String message) {
        super(message);
    }
}
