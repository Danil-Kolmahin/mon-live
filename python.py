import sys

flag = sys.argv[1]
url = sys.argv[2]

executor = None
session_id = None
if len(sys.argv) > 3:
    executor = sys.argv[3]
if len(sys.argv) > 3:
    session_id = sys.argv[4]

if str(flag) == 'simple':
    import webbrowser
    import keyboard

    if executor is None:
        webbrowser.open(url, new=0)
        print('dr.command_executor._url')
        print('dr.session_id')
    else:
        webbrowser.open(url, new=0)
        keyboard.press_and_release('ctrl+w')
        keyboard.press_and_release('ctrl+w')
        webbrowser.open(url, new=0)

else:
    from selenium import webdriver

    dr = None

    if executor is None:
        dr = webdriver.Chrome()
        print(dr.command_executor._url)
        print(dr.session_id)
    else:
        dr = webdriver.Remote(command_executor=str(executor), desired_capabilities={})
        dr.quit()
        dr.session_id = str(session_id)

    dr.get(str(url))
