package com.physics.app;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebSettings;
import android.webkit.WebViewClient;
import android.graphics.Color;
import android.util.Log;

public class MainActivity extends Activity {
    private static final String TAG = "PhysicsApp";
    private WebView wv;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        wv = new WebView(this);
        WebSettings ws = wv.getSettings();
        ws.setJavaScriptEnabled(true);
        ws.setDomStorageEnabled(true);
        ws.setAllowFileAccess(true);
        ws.setAllowContentAccess(true);
        ws.setCacheMode(WebSettings.LOAD_DEFAULT);
        wv.setBackgroundColor(Color.parseColor("#F5F7FA"));

        wv.setWebViewClient(new WebViewClient() {
            @Override
            public void onReceivedError(WebView view, int errCode, String desc, String failingUrl) {
                Log.e(TAG, "WebView error " + errCode + " : " + desc + " @ " + failingUrl);
                view.loadData(
                    "<div style='font-family:sans-serif;padding:24px;color:#333'>" +
                    "<h2 style='color:#2E86DE'>页面加载失败</h2>" +
                    "<p>错误码：" + errCode + "</p>" +
                    "<p>路径：" + failingUrl + "</p>" +
                    "<p style='color:#888;font-size:13px'>请确认 APK 内 assets/www/index.html 存在。</p>" +
                    "</div>", "text/html; charset=UTF-8", "UTF-8");
            }
        });

        // 启动前先确认 assets 里确实有 index.html
        boolean exists = false;
        try {
            exists = getAssets().list("www").length > 0;
            Log.i(TAG, "assets/www 内容: " + java.util.Arrays.toString(getAssets().list("www")));
        } catch (Exception e) {
            Log.e(TAG, "读取 assets/www 失败", e);
        }

        if (exists) {
            wv.loadUrl("file:///android_asset/www/index.html");
        } else {
            Log.e(TAG, "assets/www 不存在！");
            wv.loadData(
                "<div style='font-family:sans-serif;padding:24px;color:#333'>" +
                "<h2 style='color:#e53935'>资源缺失</h2>" +
                "<p>assets/www 目录未打包进 APK。</p>" +
                "</div>", "text/html; charset=UTF-8", "UTF-8");
        }
        setContentView(wv);
    }

    @Override
    public void onBackPressed() {
        if (wv != null && wv.canGoBack()) {
            wv.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
