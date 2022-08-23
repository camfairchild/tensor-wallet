import { jsx as _jsx } from "react/jsx-runtime";
import { Component } from "react";
import { logger } from "@polkadot/util";
import { BURNR_WALLET } from "../utils/constants";
const l = logger(BURNR_WALLET);
class ErrorBoundary extends Component {
    state = {
        hasError: false,
    };
    static getDerivedStateFromError() {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }
    componentDidCatch(error, errorInfo) {
        l.error("Uncaught error:", error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return _jsx("h1", { children: "There was an error" });
        }
        return this.props.children;
    }
}
export default ErrorBoundary;
