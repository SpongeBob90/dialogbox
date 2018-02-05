package com.wyw.dialogbox.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * @author wyw
 * @date 2018\2\5 0005 10:59
 */
@Controller
public class DialogBoxController {

    @GetMapping(value = "/index")
    public String showDialog() {
        return "html/dialog.html";
    }

}
