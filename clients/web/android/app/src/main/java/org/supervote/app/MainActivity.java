package org.supervote.app;

import android.os.Bundle;
import androidx.activity.EdgeToEdge;
import com.getcapacitor.BridgeActivity;

/**
 * The whole app is the web app in Capacitor's WebView (clients/web, npm run build:android). Drawn edge to
 * edge on every Android version, as Android 15 does anyway: the page keeps clear of the bars itself, with
 * the safe areas Capacitor gives it (SystemBars).
 */
public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // After Capacitor's onCreate, which leaves the launch theme for the app's: called before, it built the
        // window's views under the launch theme, an action bar with the splash drawable behind every view.
        EdgeToEdge.enable(this);
    }
}
