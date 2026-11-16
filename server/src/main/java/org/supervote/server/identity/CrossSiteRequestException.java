package org.supervote.server.identity;

/**
 * A request another website's page made, which its browser says in
 * Sec-Fetch-Site. Nobody's to act on, whatever it carries: see
 * VoterIdentityFilter.
 */
public class CrossSiteRequestException extends RuntimeException {

    CrossSiteRequestException() {
        super("Requests made by other websites are refused. Open super-vote itself to use it.");
    }
}
