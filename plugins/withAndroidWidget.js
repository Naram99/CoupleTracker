const { withAndroidManifest } = require("@expo/config-plugins");

module.exports = function withAndroidWidget(config) {
    return withAndroidManifest(config, (config) => {
        const mainApplication = config.modResults.manifest.application?.[0];
        if (!mainApplication) return config;

        if (!mainApplication.receiver) {
            mainApplication.receiver = [];
        }

        mainApplication.receiver.push({
            $: {
                "android:name": ".DateWidgetProvider",
                "android:exported": "true",
            },
            "intent-filter": [
                {
                    action: [
                        {
                            $: {
                                "android:name":
                                    "android.appwidget.action.APPWIDGET_UPDATE",
                            },
                        },
                    ],
                },
            ],
            "meta-data": [
                {
                    $: {
                        "android:name": "android.appwidget.provider",
                        "android:resource": "@xml/date_widget_info",
                    },
                },
            ],
        });

        return config;
    });
};
