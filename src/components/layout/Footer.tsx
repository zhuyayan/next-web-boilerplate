import * as React from 'react';
import {HTMLAttributes} from 'react';
import classNames from "classnames";

interface propsType extends HTMLAttributes<HTMLElement> {

}

const Footer: React.FC<propsType> =
    ({
         children,
         className,
         ...restProps
     }) => {
        return (
            <div
                className={classNames(className)}
                {...restProps}
            >Footer</div>
        );
    };
export default Footer;
