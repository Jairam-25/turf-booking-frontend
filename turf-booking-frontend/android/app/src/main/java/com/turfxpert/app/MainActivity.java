package com.turfxpert.app;

import android.os.Bundle;
import android.graphics.Color;
import androidx.core.view.WindowCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Enable Edge-to-Edge display (make navigation bar transparent)
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        getWindow().setNavigationBarColor(Color.TRANSPARENT);       getWindow().setStatusBarColor(Color.TRANSPARENT);
    }
}
