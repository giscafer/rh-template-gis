import React from 'react';

// 将普通组件转换为动态组件
const AsyncImport = (loadComponent, _props) => {
  return class extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        Component: null,
      };
    }

    componentDidMount() {
      if (this.state.Component !== null) return;

      loadComponent()
        .then((module) => module.default)
        .then((component) => {
          this.setState({ Component: component });
        })
        .catch((err) => {
          throw err;
        });
    }

    render() {
      const { Component } = this.state;
      return Component ? <Component {...this.props} {..._props} /> : null;
    }
  };
};

export default AsyncImport;
