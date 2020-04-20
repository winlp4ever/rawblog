import time
err = True
while err:
    try:
        raise Exception('oof')
        err = False
    except Exception as e:
        print(e)
        time.sleep(1)