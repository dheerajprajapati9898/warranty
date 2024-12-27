#import <RCTAppDelegate.h>
#import <UIKit/UIKit.h>
#import <UserNotifications/UNUserNotifications.h>
#import <RNCPushNotificationIOS.h>
// Add this inside the `didFinishLaunchingWithOptions` method
UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
center.delegate = (id<UNUserNotificationCenterDelegate>)self;

// Required to register for notifications
[application registerForRemoteNotifications];
@interface AppDelegate : RCTAppDelegate

@end
