
module.exports = function makeColumn(tengwa, above, below) {
    return new Column(tengwa, above, below);
};

var Column = function (tengwa, above, below) {
    this.above = above;
    this.barAbove = void 0;
    this.tengwa = tengwa;
    this.barBelow = void 0;
    this.below = below;
    this.following = void 0;
    this.error = void 0;
};

Column.prototype.canAddAbove = function () {
    return !this.above || (
        (this.tengwa === "silme" || this.tengwa === "esse")
        && !this.below
    );
};

Column.prototype.addAbove = function (above) {
    if (this.tengwa === "silme") {
        this.tengwa = "silme-nuquerna";
    }
    if (this.tengwa === "esse") {
        this.tengwa = "esse-nuquerna";
    }
    this.above = above;
    return this;
};

Column.prototype.canAddBelow = function () {
    return !this.below && this.tengwa !== "silme-nuquerna";
};

Column.prototype.addBelow = function (below) {
    this.below = below;
    return this;
};

Column.prototype.addBarAbove = function () {
    this.barAbove = true;
    return this;
};

Column.prototype.addBarBelow = function () {
    this.barBelow = true;
    return this;
};

Column.prototype.addFollowing = function (following) {
    this.following = following;
    return this;
};

Column.prototype.addError = function (error) {
    this.errors = this.errors || [];
    this.errors.push(error);
    return this;
};

